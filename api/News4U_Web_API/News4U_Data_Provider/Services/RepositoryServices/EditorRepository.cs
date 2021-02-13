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
        private readonly IMongoCollection<Editor> _editors;

        public EditorRepository(INews4UMongoIDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _editors = database.GetCollection<Editor>(settings.EditorsCollectionName);
        }

        public async Task AddEditor(Editor editor)
        {
            await _editors.InsertOneAsync(editor);
        }

        public async Task<Editor> GetEditor(string editorId)
        {
            Editor editor = await _editors.Find(editor => editor.Id == editorId).FirstOrDefaultAsync();
            return editor;
        }

        public async Task<Editor> GetEditorByUsername(string username)
        {
            Editor editor = await _editors.Find(editor => editor.Username == username).FirstOrDefaultAsync();
            return editor;
        }

        public async Task<bool> EditorExists(string username)
        {
            var filter = Builders<Editor>.Filter.Eq("Username", username);
            var exists = await _editors.Find(filter).AnyAsync();
            return exists;
        }

        public async Task<string> GetEditorPassword(string username)
        {
            var filter = Builders<Editor>.Filter.Eq("Username", username);
            var projection = Builders<Editor>.Projection.Include("Password").Exclude("_id");
            var password = await _editors.Find(filter).Project(projection).FirstOrDefaultAsync();
            if (password == null)
                return null;
            return password.GetElement("Password").Value.AsString;
        }

        public async Task AddNews(string editorId, string newsId)
        {
            var filter = Builders<Editor>.Filter.Eq("Id", editorId);
            var arrayUpdate = Builders<Editor>.Update.Push("MyNews", newsId);

            await _editors.UpdateOneAsync(filter, arrayUpdate);
        }

        public async Task DeleteNews(string editorId, string newsId)
        {
            var editorFilter = Builders<Editor>.Filter.Eq("Id", editorId);
            var arrayUpdate = Builders<Editor>.Update.Pull("MyNews", newsId);

            await _editors.UpdateOneAsync(editorFilter, arrayUpdate);
        }

        public async Task UpdateUser(string editorId, string propertyName, string propertyValue)
        {
            var query = Builders<Editor>.Filter.Eq("Id", editorId);
            var update = Builders<Editor>.Update.Set(propertyName, propertyValue); 
            await _editors.UpdateOneAsync(query, update);
        }

        public async Task DeleteNewsByDate(List<string> newsids, string editorId)
        {
            var editorFilter = Builders<Editor>.Filter.Eq("Id", editorId);

            var update = Builders<Editor>.Update.PullFilter(nw=>nw.MyNews, nwl => newsids.Contains(nwl));

            
            await _editors.UpdateOneAsync(ed => ed.Id == editorId, update);
       
        }
    }
} 
