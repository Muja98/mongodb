using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Helpers
{
    public class UniversalService
    {
        public static bool CompareTags(List<string> tags1, List<string> tags2)
        {
            bool found = false;
            int index = 0;

            while (!found && index < tags1.Count)
            {
                if (tags2.Contains(tags1[index]))
                    found = true;
                index++;
            }

            return found;
        }
    }
}
