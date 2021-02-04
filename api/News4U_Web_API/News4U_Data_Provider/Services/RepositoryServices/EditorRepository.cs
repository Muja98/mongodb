using News4U_Data_Provider.DatabaseSettings;
using News4U_Data_Provider.Services.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Driver;
using News4U_Data_Provider.Entities;
using System.Threading.Tasks;
using MongoDB.Bson;
using News4U_Data_Provider.DTOs;
using MongoDB.Driver.Linq;

namespace News4U_Data_Provider.Services.RepositoryServices
{
    public class EditorRepository: IEditorRepository
    {
        private readonly IMongoCollection<EditorDTO> _editors;

        public EditorRepository(INews4UMongoIDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _editors = database.GetCollection<EditorDTO>(settings.EditorsCollectionName);
        }

        public async Task AddEditor(EditorRegisterDTO editor)
        {
            await _editors.InsertOneAsync(editor.Editor);
        }

        public async Task<EditorDTO> GetEditor(string editorId)
        {
            EditorDTO editor = await _editors.Find(editor => editor.Id == editorId).FirstOrDefaultAsync();
            return editor;
        }

        public async Task<bool> StudentExists(string username)
        {
            var filter = Builders<EditorDTO>.Filter.Eq("Username", username);
            var exists = await _editors.Find(filter).AnyAsync();
            return exists;
        }

        public async Task AddNews(string editorId, string newsId)
        {
            var filter = Builders<EditorDTO>.Filter.Eq("Id", editorId);
            var arrayUpdate = Builders<EditorDTO>.Update.Push("MyNews", newsId);

            await _editors.UpdateOneAsync(filter, arrayUpdate);
        }

        public async Task DeleteNews(string editorId, string newsId)
        {
            var editorFilter = Builders<EditorDTO>.Filter.Eq("Id", editorId);
            var arrayUpdate = Builders<EditorDTO>.Update.Pull("MyNews", newsId);

            await _editors.UpdateOneAsync(editorFilter, arrayUpdate);
        }
    }
} 
