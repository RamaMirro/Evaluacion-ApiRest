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
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS configurado de forma abierta para evitar bloqueos por cambio de puerto en Live Server
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configuración de archivos estáticos (si lo usas para tus vistas)
var rHtml = Path.Combine(Directory.GetCurrentDirectory(), "/html");
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

// ¡Importante! UseCors debe ir antes de UseAuthorization y MapControllers
app.UseCors("PermitirFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();