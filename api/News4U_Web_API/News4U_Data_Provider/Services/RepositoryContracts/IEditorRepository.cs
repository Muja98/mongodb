﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using News4U_Data_Provider.DTOs;
using News4U_Data_Provider.Entities;

namespace News4U_Data_Provider.Services.RepositoryContracts
{
    public interface IEditorRepository
    {
        public Task AddEditor(Editor editor);
        public Task<Editor> GetEditor(string editorId);
        public Task<Editor> GetEditorByUsername(string username);
        public Task<bool> EditorExists(string username);
        public Task<string> GetEditorPassword(string username);
        Task AddNews(string editorId, string newsId);
        Task DeleteNews(string editorId, string newsId);
        Task UpdateUser(string editorId, string propertyName, string propertyValue);

        Task DeleteNewsByDate(List<string> newsIds, string editorId);
    }
}
