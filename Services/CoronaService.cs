using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Types;
using Newtonsoft.Json.Linq;

namespace Services
{
    public class CoronaService : ICoronaService
    {
        private readonly IHttpClientFactory _clientFactory;
        public CoronaService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        private const string Endpoint = @"http://corona-api.com/";
        public async Task<List<CoronaObject>> GetDataFromApiAsync()
        {
            var client = _clientFactory.CreateClient(new Uri(Endpoint));
            const string requestUri = "countries/fi";
            var result = await client.GetAsync(requestUri);


            var root = JObject.Parse(await result.Content.ReadAsStringAsync());
            var objects = root["data"]["timeline"].ToObject<List<CoronaObject>>();
            return objects;
        }
    }
}
