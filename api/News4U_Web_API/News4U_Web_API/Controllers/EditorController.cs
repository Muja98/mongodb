using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public EditorController(IEditorRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<ActionResult> AddEditor([FromBody] EditorRegisterDTO editor)
        {
            editor.Password = AuthentificationService.EncryptPassword(editor.Password);
            await _repository.AddEditor(editor);
            return Ok();
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
