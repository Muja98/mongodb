﻿using News4U_Data_Provider.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public class EditorRegisterDTO
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
    }
}
