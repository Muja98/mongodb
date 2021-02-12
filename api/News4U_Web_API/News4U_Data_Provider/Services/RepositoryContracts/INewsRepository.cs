using News4U_Data_Provider.DTOs;
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
        Task<News> GetNews(string newsId, int commentsCount);
        Task<IEnumerable<News>> GetAllNews(string title, string field, string tag, int from, int to);
        Task<string> AddNews(News news);
        Task<string> DeleteNews(string newsId);
        Task AddNewsPictures(string newsId, string mainPicturePath, List<Paragraph> paragraphs);
        Task<IEnumerable<News>> GetRelatedNews(string newsId);
        IEnumerable<string> GetAvailableNewsFields();
        Task VoteSurvey(string newsId, string surveyAnswerName);
        Task<IEnumerable<NamedValue>> GetSurveyResult(string newsId);
        Task AddNewComment(string newsId, Comment comment);
        Task<IEnumerable<Comment>> LoadMoreComments(string newsId, int from, int count);
        Task EditNews(string newsId, NewsEditDTO editValue);

        Task<IEnumerable<News>> DeleteNewsByDate(string editorId, DateTime date);
    }
}
