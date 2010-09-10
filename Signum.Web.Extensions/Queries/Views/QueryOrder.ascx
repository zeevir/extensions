<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl" %>
<%@ Import Namespace="Signum.Web" %>
<%@ Import Namespace="Signum.Engine" %>
<%@ Import Namespace="Signum.Entities" %>
<%@ Import Namespace="Signum.Utilities" %>
<%@ Import Namespace="Signum.Entities.Reports" %>

<%
using (var e = Html.TypeContext<QueryOrderDN>()) 
{
    using (var style = e.SubContext())
    {
        style.OnlyValue = true;
    %>
    <div style="float:left">
        <%= Html.WriteQueryToken(e.Value.Token, e)%>
    </div>
    <%  
        Html.ValueLine(style, f => f.OrderType);
    }
}
%>

