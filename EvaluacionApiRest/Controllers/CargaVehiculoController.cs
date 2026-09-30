
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using EvaluacionApiRest.Data;

namespace EvaluacionApiRest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CargaVehiculoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CargaVehiculoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CargaVehiculo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CargaVehiculo>>> GetCargaVehiculos()
        {
            return await _context.CargaVehiculos.ToListAsync();
        }

        // GET: api/CargaVehiculo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CargaVehiculo>> GetCargaVehiculo(int id)
        {
            var cargaVehiculo = await _context.CargaVehiculos.FindAsync(id);

            if (cargaVehiculo == null)
            {
                return NotFound();
            }

            return cargaVehiculo;
        }

        // PUT: api/CargaVehiculo/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCargaVehiculo(int id, CargaVehiculo cargaVehiculo)
        {
            if (id != cargaVehiculo.Id)
            {
                return BadRequest();
            }

            _context.Entry(cargaVehiculo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CargaVehiculoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/CargaVehiculo
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CargaVehiculo>> PostCargaVehiculo(CargaVehiculo cargaVehiculo)
        {
            _context.CargaVehiculos.Add(cargaVehiculo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCargaVehiculo", new { id = cargaVehiculo.Id }, cargaVehiculo);
        }

    public async Task<IActionResult> InscribirVehiculo([FromBody] CargaVehiculo altaVehiculo)
{
    // 1. Normalizar la patente (quitar espacios y pasar a mayúsculas)
    string patenteNormalizada = altaVehiculo.Patente.Trim().ToUpper();

    // 2. Validar formato (las 3 letras y 3 números que pusiste en el Front)
    if (!System.Text.RegularExpressions.Regex.IsMatch(patenteNormalizada, @"^[A-Z]{3}\d{3}$"))
    {
        return BadRequest("El formato de la patente es incorrecto. Debe ser Ej: AAA123");
    }

    // 3. VALIDACIÓN DE UNICIDAD: ¿Ya existe en la Base de Datos?
    bool yaExiste = await _context.CargaVehiculos.AnyAsync(c => c.Patente.ToUpper() == patenteNormalizada);

    if (yaExiste)
    {
        return BadRequest("La patente ya se encuentra registrada en el sistema.");
    }

    

    return Ok();
}

        // DELETE: api/CargaVehiculo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCargaVehiculo(int id)
        {
            var cargaVehiculo = await _context.CargaVehiculos.FindAsync(id);
            if (cargaVehiculo == null)
            {
                return NotFound();
            }

            _context.CargaVehiculos.Remove(cargaVehiculo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CargaVehiculoExists(int id)
        {
            return _context.CargaVehiculos.Any(e => e.Id == id);
        }
    }
}
