using System;
using System.Net.Http;

namespace Types
{
    public interface IHttpClientFactory
    {
        HttpClient CreateClient(Uri uri);
    }
}
