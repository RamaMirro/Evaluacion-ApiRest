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

// 1. Configurar CORS abierto para desarrollo con Live Server
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

// 2. ¡IMPORTANTE! UseCors debe ir de los primeros en el pipeline
app.UseCors("PermitirFrontend");

app.UseHttpsRedirection();

// Configuración de archivos estáticos corregida (sin barra inicial absoluta)
var rHtml = Path.Combine(Directory.GetCurrentDirectory(), "html");
if (!Directory.Exists(rHtml))
{
    Directory.CreateDirectory(rHtml);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(rHtml),
    RequestPath = "/html"
});

app.UseAuthorization();

app.MapControllers();

app.Run();