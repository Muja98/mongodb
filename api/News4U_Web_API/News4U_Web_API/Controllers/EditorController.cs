using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using News4U_Data_Provider.DTOs;
using News4U_Data_Provider.Entities;
using News4U_Data_Provider.Services.RepositoryContracts;
using News4U_Helpers;

namespace News4U_Web_API.Controllers
{
    [ApiController]
    [Route("api/editors")]
    public class EditorController : ControllerBase
    {
        private readonly IEditorRepository _repository;
        private readonly IMapper _mapper;
        public EditorController(IEditorRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult> AddEditor([FromBody] EditorRegisterDTO editorInfo)
        {
            if (!await _repository.EditorExists(editorInfo.Username))
            {
                editorInfo.Password = AuthentificationService.EncryptPassword(editorInfo.Password);
                Editor editor = _mapper.Map<Editor>(editorInfo);
                await _repository.AddEditor(editor);
                var token = JwtManager.GenerateJWToken(editor);
                return Ok(new JsonResult(token));
            }
            else
                return Ok(new JsonResult("Email taken"));
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LogEditorIn([FromBody] EditorLoginDTO editorCredentials)
        {
            string savedPwd = await _repository.GetEditorPassword(editorCredentials.Username);
            if (savedPwd != null)
            {
                if (AuthentificationService.IsPasswordCorrect(savedPwd, editorCredentials.Password))
                {
                    Editor editor = await _repository.GetEditorByUsername(editorCredentials.Username);
                    string token = JwtManager.GenerateJWToken(editor);
                    return Ok(new JsonResult(token));
                }
                else
                    return Ok(new JsonResult("Wrong password"));
            }
            else
                return Ok(new JsonResult("Non-existent username"));
        }

        [HttpGet]
        [Route("{editorId}")]
        public async Task<ActionResult> GetEditor(string editorId)
        {
            var editor = await _repository.GetEditor(editorId);
            return Ok(editor);   
        }
    }
}
