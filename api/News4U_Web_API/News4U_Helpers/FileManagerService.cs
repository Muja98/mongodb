using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace News4U_Helpers
{
    public class FileManagerService
    {
        private static readonly string _folderPrefix = @"..\..\Images\";
        public static string SaveImageToFile(string base64Image, string pathPosfix)
        {
            byte[] bytes = Convert.FromBase64String(base64Image);
            string imagePath = _folderPrefix + pathPosfix + ".png";
            File.WriteAllBytes(imagePath, bytes);
            return imagePath;
        }

        public static string LoadImageFromFile(string pathPostfix)
        {
            string base64Image = "";
            if (!string.IsNullOrEmpty(pathPostfix))
            {
                byte[] bytes = File.ReadAllBytes(_folderPrefix + pathPostfix + ".png");
                base64Image = Convert.ToBase64String(bytes);
            }
            return base64Image;
        }
    }
}
