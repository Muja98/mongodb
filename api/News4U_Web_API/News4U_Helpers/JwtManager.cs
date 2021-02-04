using News4U_Data_Provider.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace News4U_Helpers
{
    public class JwtManager
    {
        public static string GenerateJWToken(Editor editor, string id)
        {
            var claims = new[] {
                new Claim("id", id),
                new Claim("firstName", editor.FirstName),
                new Claim("lastName", editor.LastName),
                new Claim("username", editor.Username)
            };

            var token = new JwtSecurityToken(null, null, claims);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
