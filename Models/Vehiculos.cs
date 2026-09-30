using System.ComponentModel.DataAnnotations;
using System.Xml.Schema;
using NuGet.Common;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EvaluacionApiRest
{

    
    public class CargaVehiculo
    {   
        [Key]
        public int Id { get; set; }
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public  int Año { get; set; }
        public string? Patente { get; set; }
        public int Km {get; set;}
        public  DateOnly FechaIngreso { get; set; }
        public bool Disponible { get; set; }


    }

}

