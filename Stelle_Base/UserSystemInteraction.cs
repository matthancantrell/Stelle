using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Stelle_Base
{
    public class UserSystemInteraction
    {
        public void Start()
        {
            bool isOver = false;
            Console.WriteLine("Welcome to Stelle! Ask Stelle Anything Code Related For Help!");
            while (!isOver)
            {
                string userInput = Console.ReadLine();
                if (userInput.ToLower().Equals("end"))
                {
                    isOver = true;
                }
                else
                {
                    Console.WriteLine("User: " + userInput);
                }
            }
        }
    }
}
