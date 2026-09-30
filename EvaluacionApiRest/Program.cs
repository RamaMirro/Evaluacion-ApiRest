using EvaluacionApiRest.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException(
            "Connection string 'DefaultConnection' not found.")
    ));
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
     {
         policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500") // El puerto de tu frontend
               .AllowAnyHeader()
               .AllowAnyMethod();
     });
});


var app = builder.Build();
app.UseCors("PermitirFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// 2. Configuramos qué archivo debe buscar por defecto (ej: index.html o tu archivo principal)
var rHtml = Path.Combine(Directory.GetCurrentDirectory(), "/html");

// Asegura que la carpeta exista antes de pasarla al proveedor
if (!Directory.Exists(rHtml))
{
    Directory.CreateDirectory(rHtml);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(rHtml),
    RequestPath = "/html"
});


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
