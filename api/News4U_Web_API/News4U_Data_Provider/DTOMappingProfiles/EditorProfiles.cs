using AutoMapper;
using News4U_Data_Provider.DTOs;
using News4U_Data_Provider.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOMappingProfiles
{
    public class EditorProfiles: Profile
    {
        public EditorProfiles()
        {
            CreateMap<EditorRegisterDTO, Editor>();
        }
    }
}
