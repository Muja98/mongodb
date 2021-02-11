using AutoMapper;
using News4U_Data_Provider.DTOs;
using News4U_Data_Provider.Entities;
using News4U_Helpers;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOMappingProfiles
{
    public class NewsProfiles: Profile
    {
        public NewsProfiles()
        {
            CreateMap<News, NewsInfoDTO>()
                .ForMember(dest =>
                    dest.Paragraphs,
                    opt => opt.MapFrom(
                        src => new List<Paragraph>() { new Paragraph
                        {
                            Text = src.Paragraphs[0].Text,
                            SubTitle = src.Paragraphs[0].SubTitle,
                            PicturePath = !string.IsNullOrEmpty(src.Paragraphs[0].PicturePath) ?
                                            FileManagerService.LoadImageFromFile("paragraphPicture0" + src.Id) :
                                            null
                        }
                        }))
                .ForMember(dest =>
                    dest.MainPicturePath,
                    opt => opt.MapFrom(
                        src => !string.IsNullOrEmpty(src.MainPicturePath) ?
                                    FileManagerService.LoadImageFromFile("mainPicture" + src.Id) :
                                    null));
        }
    }
}
