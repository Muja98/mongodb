using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using News4U_Data_Provider.DTOs;
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
        private readonly IMapper _mapper;

        public NewsController(INewsRepository repository, IEditorRepository editorRepository, IMapper mapper)
        {
            _repository = repository;
            _editorRepository = editorRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllNews([FromQuery] string title, [FromQuery] string field, [FromQuery] string tag, [FromQuery] int from, [FromQuery] int to)
        {
            var news = await _repository.GetAllNews(title, field, tag, from, to);
            var result = _mapper.Map<IEnumerable<News>, IEnumerable<NewsInfoDTO>>(news);
            return Ok(result);
        }

        [HttpGet]
        [Route("editor/{editorId}")]
        public async Task<ActionResult> GetNewsForEditor(string editorId)
        {
            var news = await _repository.GetNewsForEditor(editorId);
            var result = _mapper.Map<IEnumerable<News>, IEnumerable<NewsInfoDTO>>(news);
            return Ok(result);
        }

        [HttpGet]
        [Route("{newsId}")]
        public async Task<ActionResult> GetNews(string newsId, [FromQuery] int commentsCount)
        {
            var news = await _repository.GetNews(newsId, commentsCount);
            if (!string.IsNullOrEmpty(news.MainPicturePath))
            {
                news.MainPicturePath = FileManagerService.LoadImageFromFile(news.MainPicturePath);
            }
            if (news.Paragraphs != null)
            {
                foreach (Paragraph p in news.Paragraphs)
                {
                    if (!string.IsNullOrEmpty(p.PicturePath))
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
            if (!string.IsNullOrEmpty(news.MainPicturePath))
            {
                tempNewsMainPicture = news.MainPicturePath;
                news.MainPicturePath = null;
            }

            foreach (Paragraph p in news.Paragraphs)
            {
                if (!string.IsNullOrEmpty(p.PicturePath))
                {
                    tempNewsParagraphs = news.Paragraphs;
                    news.Paragraphs = null;
                    break;
                }
            }

            string newsId = await _repository.AddNews(news);

            if (!string.IsNullOrEmpty(tempNewsMainPicture) || tempNewsParagraphs != null)
            {
                if (!string.IsNullOrEmpty(tempNewsMainPicture))
                    news.MainPicturePath = FileManagerService.SaveImageToFile(tempNewsMainPicture, "mainPicture" + news.Id);

                if (tempNewsParagraphs != null)
                {
                    int i = 0;
                    news.Paragraphs = tempNewsParagraphs;
                    foreach (Paragraph p in tempNewsParagraphs)
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

        [HttpGet]
        [Route("available-fields")]
        public ActionResult GetAvailableNewsFields()
        {
            var newsFields = _repository.GetAvailableNewsFields();
            return Ok(newsFields);
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
            var srv = await _repository.GetSurveyResult(newsId);
            return Ok(srv);
        }

        [HttpPost]
        [Route("{newsId}/comment")]
        public async Task<ActionResult> AddNewComment(string newsId, [FromBody] Comment comment)
        {
            await _repository.AddNewComment(newsId, comment);
            return Ok();
        }

        [HttpGet]
        [Route("{newsId}/get-comments")]
        public async Task<ActionResult> GetMoreComments(string newsId, [FromQuery] int from, [FromQuery] int count)
        {
            IEnumerable<Comment> comments = await _repository.LoadMoreComments(newsId, from, count);
            return Ok(comments);
        }

        [HttpPut]
        [Route("edit-string-prop/{newsId}")]
        public async Task<ActionResult> StringNewsEdit(string newsId, [FromBody] StringNewsEditDTO editValue)
        {
            await _repository.EditNews(newsId, editValue);
            return Ok();
        }

        [HttpPut]
        [Route("edit-survey-prop/{newsId}")]
        public async Task<ActionResult> SurveyNewsEdit(string newsId, [FromBody] SurveyNewsEditDTO editValue)
        {
            await _repository.EditNews(newsId, editValue);
            return Ok();
        }

        [HttpPut]
        [Route("edit-string-list-prop/{newsId}")]
        public async Task<ActionResult> StringListNewsEdit(string newsId, [FromBody] StringListNewsEditDTO editValue)
        {
            await _repository.EditNews(newsId, editValue);
            return Ok();
        }

        [HttpPut]
        [Route("edit-picture-prop/{newsId}")]
        public async Task<ActionResult> PictureListNewsEdit(string newsId, [FromBody] PictureNewsEditDTO editValue)
        {
            if (!string.IsNullOrEmpty(editValue.Picture))
            {
                editValue.Picture = FileManagerService.SaveImageToFile(editValue.Picture, "mainPicture" + newsId);
            }
            await _repository.EditNews(newsId, editValue);
            return Ok();
        }

        [HttpPut]
        [Route("edit-paragraph-list-prop/{newsId}")]
        public async Task<ActionResult> ParagraphListNewsEdit(string newsId, [FromBody] ParagraphListEditDTO editValue)
        {
            int i = 0;
            foreach (Paragraph p in editValue.Paragraphs)
            {
                if (!string.IsNullOrEmpty(p.PicturePath))
                    p.PicturePath = FileManagerService.SaveImageToFile(p.PicturePath, "paragraphPicture" + i + newsId);
                i++;
            }
            await _repository.EditNews(newsId, editValue);
            return Ok();
        }

        [HttpPut]
        [Route("edit-chart-prop/{newsId}")]
        public async Task<ActionResult> ChartNewsEdit(string newsId, [FromBody] ChartNewsEditDTO editValue)
        {
            await _repository.EditNews(newsId, editValue);
            return Ok();
        }

        [HttpDelete]
        [Route("{editorId}/date/{date}")]
        public async Task<IActionResult> DeleteByDate(string editorId, DateTime date)
        {
            IEnumerable<News> newsList = await _repository.DeleteNewsByDate(editorId, date);

            List<string> newsIds = new List<string>();
            foreach (News n in newsList)
            {
                newsIds.Add(n.Id);
            }

            await _editorRepository.DeleteNewsByDate(newsIds, editorId);
              

            return Ok();
        }
    }
}
