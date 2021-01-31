using News4U_Data_Provider.DatabaseSettings;
using News4U_Data_Provider.Services.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Driver;
using News4U_Data_Provider.Entities;
using System.Threading.Tasks;
using MongoDB.Bson;

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
    }
}
