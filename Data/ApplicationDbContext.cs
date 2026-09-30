
using Microsoft.EntityFrameworkCore;


namespace EvaluacionApiRest.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<CargaVehiculo> CargaVehiculos { get; set; }
    
}