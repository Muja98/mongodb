using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using News4U_Data_Provider.Entities;
using News4U_Data_Provider.Services.RepositoryContracts;

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
            return Ok(news);
        }

        [HttpPost]
        [Route("{editorId}")]
        public async Task<ActionResult> AddNews(string editorId, [FromBody] News news)
        {
            string newsId = await _repository.AddNews(news);

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
    }
}
