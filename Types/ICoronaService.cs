using System.Collections.Generic;
using System.Threading.Tasks;

namespace Types
{
    public interface ICoronaService
    {
        Task<List<CoronaObject>> GetDataFromApiAsync();
    }
}