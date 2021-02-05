using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using News4U_Data_Provider.DatabaseSettings;
using News4U_Data_Provider.Services.RepositoryServices;
using News4U_Data_Provider.Services.RepositoryContracts;
using MongoDB.Bson.Serialization.Conventions;
using AutoMapper;
using News4U_Data_Provider.DTOMappingProfiles;

namespace News4U_Web_API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            ConventionRegistry.Register("Ignore null values", new ConventionPack
            {
                new IgnoreIfNullConvention(true)
            }, t => true);
            services.Configure<News4UMongoDatabaseSettings>(Configuration.GetSection(nameof(News4UMongoDatabaseSettings)));

            services.AddSingleton<INews4UMongoIDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<News4UMongoDatabaseSettings>>().Value);
            services.AddSingleton<IEditorRepository, EditorRepository>();
            services.AddSingleton<INewsRepository, NewsRepository>();
            services.AddAutoMapper(typeof(EditorProfiles));
            services.AddCors(options =>
            {
                options.AddPolicy("CORS", builder =>
                {
                    builder.AllowAnyHeader()
                   .AllowAnyMethod()
                   .SetIsOriginAllowed((host) => true)
                   .AllowCredentials();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CORS");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
