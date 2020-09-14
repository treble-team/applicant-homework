using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Types;

namespace Applicant_homework.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CoronaController : ControllerBase
    {
        private readonly ICoronaService _coronaService;
        public CoronaController(ICoronaService coronaService)
        {
            _coronaService = coronaService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CoronaObject>>> GetCoronaData()
        {
            var objects = await _coronaService.GetDataFromApiAsync();
            return Ok(objects);
        }
    }
}
