using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using News4U_Data_Provider.Entities;
using News4U_Data_Provider.Services.RepositoryContracts;
using News4U_Helpers;

namespace News4U_Web_API.Controllers
{
    [ApiController]
    [Route("api/news")]
    public class NewsController : ControllerBase
    {
        private readonly INewsRepository _repository;
        private readonly IEditorRepository _editorRepository;

        public NewsController(INewsRepository repository, IEditorRepository editorRepository)
        {
            _repository = repository;
            _editorRepository = editorRepository;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllNews([FromQuery] string title, [FromQuery] string field, [FromQuery] string tag, [FromQuery] int from, [FromQuery] int to)
        {
            var news = await _repository.GetAllNews(title, field, tag, from, to);
            return Ok(news);
        }

        [HttpGet]
        [Route("editor/{editorId}")]
        public async Task<ActionResult> GetNewsForEditor(string editorId)
        {
            var news = await _repository.GetNewsForEditor(editorId);
            return Ok(news);
        }

        [HttpGet]
        [Route("{newsId}")]
        public async Task<ActionResult> GetNews(string newsId)
        {
            var news = await _repository.GetNews(newsId);
            if(!string.IsNullOrEmpty(news.MainPicturePath))
            {
                news.MainPicturePath = FileManagerService.LoadImageFromFile(news.MainPicturePath);
            }
            if(news.Paragraphs != null)
            {
                foreach(Paragraph p in news.Paragraphs)
                {
                    if(!string.IsNullOrEmpty(p.PicturePath))
                    {
                        p.PicturePath = FileManagerService.LoadImageFromFile(p.PicturePath);
                    }
                }    
            }
            return Ok(news);
        }

        [HttpPost]
        [Route("{editorId}")]
        public async Task<ActionResult> AddNews(string editorId, [FromBody] News news)
        {
            string tempNewsMainPicture = null;
            List<Paragraph> tempNewsParagraphs = null;
            if(!string.IsNullOrEmpty(news.MainPicturePath))
            {
                tempNewsMainPicture = news.MainPicturePath;
                news.MainPicturePath = null;
            }

            foreach(Paragraph p in news.Paragraphs)
            {
                if(!string.IsNullOrEmpty(p.PicturePath))
                {
                    tempNewsParagraphs = news.Paragraphs;
                    news.Paragraphs = null;
                    break;
                }
            }

            string newsId = await _repository.AddNews(news);

            if (!string.IsNullOrEmpty(tempNewsMainPicture) || tempNewsParagraphs != null) 
            {
                if(!string.IsNullOrEmpty(tempNewsMainPicture))
                    news.MainPicturePath = FileManagerService.SaveImageToFile(tempNewsMainPicture, "mainPicture" + news.Id);

                if(tempNewsParagraphs != null)
                {
                    int i = 0;
                    news.Paragraphs = tempNewsParagraphs;
                    foreach(Paragraph p in tempNewsParagraphs)
                    {
                        if (!string.IsNullOrEmpty(p.PicturePath))
                            news.Paragraphs.ElementAt(i).PicturePath = FileManagerService.SaveImageToFile(p.PicturePath, "paragraphPicture" + i + news.Id);
                        i++;
                    }
                }

                await _repository.AddNewsPictures(newsId, news.MainPicturePath, news.Paragraphs);

            }

            if (newsId != null && newsId != "")
            {
                await _editorRepository.AddNews(editorId, newsId);
            }

            return Ok();
        }

        [HttpDelete]
        [Route("{newsId}")]
        public async Task<ActionResult> DeleteNews(string newsId)
        {
            string editorId = await _repository.DeleteNews(newsId);
            await _editorRepository.DeleteNews(editorId, newsId);

            return Ok();
        }

        [HttpGet]
        [Route("{newsId}/related-news")]
        public async Task<ActionResult> GetRelatedNews(string newsId)
        {
            var result = await _repository.GetRelatedNews(newsId);
            return Ok(result);
        }
        
        [HttpPatch]
        [Route("{newsId}/survey/{surveyAnswerName}")]
        public async Task<ActionResult> VoteSurvey(string newsId, string surveyAnswerName)
        {
            await _repository.VoteSurvey(newsId, surveyAnswerName);
            return Ok();
        }

        [HttpGet]
        [Route("{newsId}/survey")]
        public async Task<ActionResult> GetSurveyResult(string newsId)
        {
            var srv = await  _repository.GetSurveyResult(newsId);
            return Ok(srv);
        }

        [HttpPost]
        [Route("{newsId}/comment")]
        public async Task<IActionResult> AddNewComment(string newsId, [FromBody] Comment comment)
        {
            await _repository.AddNewComment(newsId, comment);
            return Ok();
        }
    }
}
