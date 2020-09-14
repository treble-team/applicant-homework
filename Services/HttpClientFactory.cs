using System;
using System.Net.Http;
using Types;

namespace Services
{
    public class HttpClientFactory : IHttpClientFactory
    {
        private static HttpClient _httpClient;
        
        public HttpClient CreateClient(Uri uri)
        {
            if (_httpClient is null)
            {
                _httpClient = new HttpClient() { BaseAddress = uri };
                _httpClient.DefaultRequestHeaders.Accept.Clear();
            }

            return _httpClient;
        }
    }
}
