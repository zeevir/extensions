﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.18033
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Signum.Web.Extensions.Files.Views
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Mvc;
    using System.Web.Mvc.Ajax;
    using System.Web.Mvc.Html;
    using System.Web.Routing;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.WebPages;
    using Signum.Entities;
    
    #line 1 "..\..\Files\Views\FileRepository.cshtml"
    using Signum.Entities.Files;
    
    #line default
    #line hidden
    using Signum.Utilities;
    using Signum.Web;
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "1.5.4.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/Files/Views/FileRepository.cshtml")]
    public partial class FileRepository : System.Web.Mvc.WebViewPage<dynamic>
    {
        public FileRepository()
        {
        }
        public override void Execute()
        {


            
            #line 2 "..\..\Files\Views\FileRepository.cshtml"
 using (var e = Html.TypeContext<FileRepositoryDN>())
{
    
            
            #line default
            #line hidden
            
            #line 4 "..\..\Files\Views\FileRepository.cshtml"
Write(Html.ValueLine(e, f => f.Name));

            
            #line default
            #line hidden
            
            #line 4 "..\..\Files\Views\FileRepository.cshtml"
                                   
    
            
            #line default
            #line hidden
            
            #line 5 "..\..\Files\Views\FileRepository.cshtml"
Write(Html.ValueLine(e, f => f.Active));

            
            #line default
            #line hidden
            
            #line 5 "..\..\Files\Views\FileRepository.cshtml"
                                     
    
            
            #line default
            #line hidden
            
            #line 6 "..\..\Files\Views\FileRepository.cshtml"
Write(Html.ValueLine(e, f => f.PhysicalPrefix));

            
            #line default
            #line hidden
            
            #line 6 "..\..\Files\Views\FileRepository.cshtml"
                                             
    
            
            #line default
            #line hidden
            
            #line 7 "..\..\Files\Views\FileRepository.cshtml"
Write(Html.ValueLine(e, f => f.WebPrefix));

            
            #line default
            #line hidden
            
            #line 7 "..\..\Files\Views\FileRepository.cshtml"
                                        
    
            
            #line default
            #line hidden
            
            #line 8 "..\..\Files\Views\FileRepository.cshtml"
Write(Html.EntityList(e, f => f.FileTypes));

            
            #line default
            #line hidden
            
            #line 8 "..\..\Files\Views\FileRepository.cshtml"
                                         
    if (!e.Value.IsNew)
    {
    
            
            #line default
            #line hidden
            
            #line 11 "..\..\Files\Views\FileRepository.cshtml"
Write(Html.CountSearchControl(new FindOptions(typeof(FilePathDN), "Repository", e.Value), csc =>
    {
        csc.PopupViewPrefix = "files";
        csc.WriteQueryName = WriteQueryName.Field;
    }));

            
            #line default
            #line hidden
            
            #line 15 "..\..\Files\Views\FileRepository.cshtml"
      ;
    }
}
            
            #line default
            #line hidden

        }
    }
}
#pragma warning restore 1591
