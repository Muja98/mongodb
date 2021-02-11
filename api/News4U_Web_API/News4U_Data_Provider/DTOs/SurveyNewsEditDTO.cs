using News4U_Data_Provider.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public class SurveyNewsEditDTO : NewsEditDTO
    {
        public Survey Survey { get; set; }

        public override object GetValue()
        {
            foreach(NamedValue nv in Survey.AnswerValue)
            {
                nv.Value = 0;
            }
            return Survey;
        }
    }
}
