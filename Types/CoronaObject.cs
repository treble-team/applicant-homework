using System;

namespace Types
{
    public class CoronaObject
    {
        public DateTime Date { get; set; }
        public int Deaths { get; set; }
        public int Confirmed { get; set; }
        public int Active { get; set; }
        public int Recovered { get; set; }
    }
}
