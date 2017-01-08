﻿using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Signum.Entities;
using Signum.Entities.Basics;
using Signum.Utilities;
using Signum.Utilities.ExpressionTrees;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Signum.Entities.Dynamic
{
    [Serializable, EntityKind(EntityKind.Main, EntityData.Master)]
    public class DynamicMixinConnectionEntity : Entity
    {
        [NotNullable]
        [NotNullValidator]
        public Lite<TypeEntity> Type { get; set; }

        [NotNullable]
        [NotNullValidator]
        public Lite<DynamicTypeEntity> DynamicMixin { get; set; }

        static Expression<Func<DynamicMixinConnectionEntity, string>> ToStringExpression = @this => @this.Type + " - " + @this.DynamicMixin;
        [ExpressionField]
        public override string ToString()
        {
            return ToStringExpression.Evaluate(this);
        }
    }

    [AutoInit]
    public static class DynamicMixinConnectionOperation
    {
        public static readonly ExecuteSymbol<DynamicMixinConnectionEntity> Save;
        public static readonly DeleteSymbol<DynamicMixinConnectionEntity> Delete;
    }
}