using News4U_Data_Provider.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace News4U_Data_Provider.Services.RepositoryContracts
{
    public interface INewsRepository
    {
        Task<IEnumerable<News>> GetNewsForEditor(string editorId);
        Task<News> GetNews(string newsId);
        Task<IEnumerable<News>> GetAllNews(string title, string field, string tag, int from, int to);
        Task<string> AddNews(News news);
        Task<string> DeleteNews(string newsId);
    }
}
