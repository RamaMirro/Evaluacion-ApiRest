using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EvaluacionApiRest;
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
