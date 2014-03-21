﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Signum.Entities.Authorization;
using Signum.Entities.Processes;
using Signum.Utilities;
using Signum.Entities;
using Signum.Entities.Mailing;
using Signum.Entities.Basics;
using System.Globalization;
using System.ComponentModel;
using Signum.Entities.DynamicQuery;
using System.Net.Mail;
using System.Linq.Expressions;
using Signum.Entities.Files;
using System.Security.Cryptography;

namespace Signum.Entities.Mailing
{
    [Serializable, EntityKind(EntityKind.Main, EntityData.Transactional)]
    public class EmailMessageDN : Entity
    {   
        public EmailMessageDN()
        {
            this.UniqueIdentifier = Guid.NewGuid();
        }

        [NotNullable]
        MList<EmailRecipientDN> recipients = new MList<EmailRecipientDN>();
        [CountIsValidator(ComparisonType.GreaterThan, 0)]
        public MList<EmailRecipientDN> Recipients
        {
            get { return recipients; }
            set { Set(ref recipients, value, () => Recipients); }
        }

        [ImplementedByAll]
        Lite<IdentifiableEntity> target;
        public Lite<IdentifiableEntity> Target
        {
            get { return target; }
            set { Set(ref target, value, () => Target); }
        }

        [NotNullable]
        EmailAddressDN from;
        [NotNullValidator]
        public EmailAddressDN From
        {
            get { return from; }
            set { Set(ref from, value, () => From); }
        }

        Lite<SmtpConfigurationDN> smtpConfiguration;
        public Lite<SmtpConfigurationDN> SmtpConfiguration
        {
            get { return smtpConfiguration; }
            set { Set(ref smtpConfiguration, value, () => SmtpConfiguration); }
        }

        Lite<EmailTemplateDN> template;
        public Lite<EmailTemplateDN> Template
        {
            get { return template; }
            set { Set(ref template, value, () => Template); }
        }

        DateTime creationTime = TimeZoneManager.Now;
        public DateTime CreationTime
        {
            get { return creationTime; }
            private set { Set(ref creationTime, value, () => CreationTime); }
        }

        DateTime? sent;
        public DateTime? Sent
        {
            get { return sent; }
            set { SetToStr(ref sent, value, () => Sent); }
        }

        DateTime? receptionNotified;
        public DateTime? ReceptionNotified
        {
            get { return receptionNotified; }
            set { Set(ref receptionNotified, value, () => ReceptionNotified); }
        }

        [SqlDbType(Size = int.MaxValue)]
        string subject;
        [StringLengthValidator(AllowNulls = true, Min = 3)]
        public string Subject
        {
            get { return subject; }
            set { if (Set(ref subject, value, () => Subject))CalculateHash(); }
        }

        [SqlDbType(Size = int.MaxValue)]
        string body;
        [StringLengthValidator(AllowNulls = true, Min = 3)]
        public string Body
        {
            get { return body; }
            set { if (Set(ref body, value, () => Subject))CalculateHash(); }
        }

        static readonly char[] spaceChars = new[] { '\r', '\n', ' ' };

        void CalculateHash()
        {
            var str = subject + body;

            BodyHash = Convert.ToBase64String(SHA1.Create().ComputeHash(Encoding.ASCII.GetBytes(str.Trim(spaceChars))));
        }

        [NotNullable, SqlDbType(Size = 150)]
        string bodyHash;
        [StringLengthValidator(AllowNulls = false, Min = 3, Max = 150)]
        public string BodyHash
        {
            get { return bodyHash; }
            set { Set(ref bodyHash, value, () => BodyHash); }
        }

        bool isBodyHtml = false;
        public bool IsBodyHtml
        {
            get { return isBodyHtml; }
            set { Set(ref isBodyHtml, value, () => IsBodyHtml); }
        }

        Lite<ExceptionDN> exception;
        public Lite<ExceptionDN> Exception
        {
            get { return exception; }
            set { Set(ref exception, value, () => Exception); }
        }

        EmailMessageState state;
        public EmailMessageState State
        {
            get { return state; }
            set { Set(ref state, value, () => State); }
        }

        Guid? uniqueIdentifier;
        public Guid? UniqueIdentifier
        {
            get { return uniqueIdentifier; }
            set { Set(ref uniqueIdentifier, value, () => UniqueIdentifier); }
        }

        bool editableMessage = true;
        public bool EditableMessage
        {
            get { return editableMessage; }
            set { Set(ref editableMessage, value, () => EditableMessage); }
        }

        Lite<EmailPackageDN> package;
        public Lite<EmailPackageDN> Package
        {
            get { return package; }
            set { Set(ref package, value, () => Package); }
        }

        [NotNullable]
        MList<EmailAttachmentDN> attachments = new MList<EmailAttachmentDN>();
        [NotNullValidator, NoRepeatValidator]
        public MList<EmailAttachmentDN> Attachments
        {
            get { return attachments; }
            set { Set(ref attachments, value, () => Attachments); }
        }

        static StateValidator<EmailMessageDN, EmailMessageState> validator = new StateValidator<EmailMessageDN, EmailMessageState>(
            m => m.State, m => m.Exception, m => m.Sent, m => m.ReceptionNotified, m => m.Package)
            {
{EmailMessageState.Created,      false,         false,        false,                    null },
{EmailMessageState.Sent,         false,         true,         false,                    null },
{EmailMessageState.SentException,true,          true,         false,                    null },
{EmailMessageState.ReceptionNotified,true,      true,         true,                     null },
{EmailMessageState.Received,     false,         false,         false,                    false },
            };

        static Expression<Func<EmailMessageDN, string>> ToStringExpression = e => e.Subject;
        public override string ToString()
        {
            return ToStringExpression.Evaluate(this);
        }
    }


    [Serializable]
    public class EmailReceptionMixin : MixinEntity
    {
        protected EmailReceptionMixin(IdentifiableEntity mainEntity, MixinEntity next) : base(mainEntity, next)
        {
        }

        EmailReceptionInfoDN receptionInfo;
        public EmailReceptionInfoDN ReceptionInfo
        {
            get { return receptionInfo; }
            set { Set(ref receptionInfo, value, () => ReceptionInfo); }
        }
    }

    [Serializable]
    public class EmailReceptionInfoDN : EmbeddedEntity
    {
        [NotNullable, SqlDbType(Size = 100), UniqueIndex(AllowMultipleNulls = true)]
        string uniqueId;
        [StringLengthValidator(AllowNulls = false, Min = 3, Max = 100)]
        public string UniqueId
        {
            get { return uniqueId; }
            set { Set(ref uniqueId, value, () => UniqueId); }
        }

        [NotNullable]
        Lite<Pop3ReceptionDN> reception;
        [NotNullValidator]
        public Lite<Pop3ReceptionDN> Reception
        {
            get { return reception; }
            set { Set(ref reception, value, () => Reception); }
        }

        [SqlDbType(Size = int.MaxValue), NotNullable]
        string rawContent;
        public string RawContent
        {
            get { return rawContent; }
            set { Set(ref rawContent, value, () => RawContent); }
        }

        DateTime sentDate;
        public DateTime SentDate
        {
            get { return sentDate; }
            set { Set(ref sentDate, value, () => SentDate); }
        }

        DateTime receivedDate;
        public DateTime ReceivedDate
        {
            get { return receivedDate; }
            set { Set(ref receivedDate, value, () => ReceivedDate); }
        }

        DateTime? deletionDate;
        public DateTime? DeletionDate
        {
            get { return deletionDate; }
            set { Set(ref deletionDate, value, () => DeletionDate); }
        }
    }






    [Serializable]
    public class EmailAttachmentDN : EmbeddedEntity
    {
        EmailAttachmentType type;
        public EmailAttachmentType Type
        {
            get { return type; }
            set { Set(ref type, value, () => Type); }
        }

        [NotNullable]
        FilePathDN file;
        [NotNullValidator]
        public FilePathDN File
        {
            get { return file; }
            set
            {
                if (Set(ref file, value, () => File))
                {
                    if (ContentId == null && File != null)
                        ContentId = Guid.NewGuid() + File.FileName;
                }
            }
        }

        [NotNullable, SqlDbType(Size = 100)]
        string contentId;
        [StringLengthValidator(AllowNulls = false, Min = 3, Max = 100)]
        public string ContentId
        {
            get { return contentId; }
            set { Set(ref contentId, value, () => ContentId); }
        }

        public EmailAttachmentDN Clone()
        {
            return new EmailAttachmentDN
            {
                ContentId = contentId,
                File = file,
                Type = type,
            }; 
        }

        internal bool Similar(EmailAttachmentDN a)
        {
            return ContentId == a.ContentId || File.FileName == a.File.FileName;
        }
    }

    public enum EmailAttachmentType
    {
        Attachment,
        LinkedResource
    }

    [Serializable]
    public class EmailRecipientDN : EmailAddressDN, IEquatable<EmailRecipientDN>
    {
        public EmailRecipientDN() { }

        public EmailRecipientDN(EmailOwnerData data)
            : base(data)
        {
            kind = EmailRecipientKind.To;
        }

        public EmailRecipientDN(MailAddress ma, EmailRecipientKind kind) : base(ma)
        {
            this.kind = kind;
        }

        EmailRecipientKind kind;
        public EmailRecipientKind Kind
        {
            get { return kind; }
            set { Set(ref kind, value, () => Kind); }
        }

        public new EmailRecipientDN Clone()
        {
            return new EmailRecipientDN
            {
                 DisplayName = DisplayName,
                 EmailAddress = EmailAddress, 
                 EmailOwner = EmailOwner,
                 Kind = Kind,
            };
        }

        public bool Equals(EmailRecipientDN other)
        {
            return base.Equals((EmailAddressDN)other) && kind == other.kind;
        }

        public override bool Equals(object obj)
        {
            return obj is EmailAddressDN && Equals((EmailAddressDN)obj);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode() ^ kind.GetHashCode();
        }

        public string BaseToString()
        {
            return base.ToString();
        }

        public override string ToString()
        {
            return "{0}: {1}".Formato(kind.NiceToString(), base.ToString());
        }
    }

    public enum EmailRecipientKind
    { 
        To,
        Cc,
        Bcc
    }

    [Serializable]
    public class EmailAddressDN : EmbeddedEntity, IEquatable<EmailAddressDN>
    {
        public EmailAddressDN() { }

        public EmailAddressDN(EmailOwnerData data)
        {
            emailOwner = data.Owner;
            emailAddress = data.Email;
            displayName = data.DisplayName;
        }

        public EmailAddressDN(MailAddress mailAddress)
        {
            displayName = mailAddress.DisplayName;
            emailAddress = mailAddress.Address;
        }

        Lite<IEmailOwnerDN> emailOwner;
        public Lite<IEmailOwnerDN> EmailOwner
        {
            get { return emailOwner; }
            set { Set(ref emailOwner, value, () => EmailOwner); }
        }

        [NotNullable, SqlDbType(Size = 100)]
        string emailAddress;
        [EMailValidator, StringLengthValidator(AllowNulls = false, Min = 3, Max = 100)]
        public string EmailAddress
        {
            get { return emailAddress; }
            set { Set(ref emailAddress, value, () => EmailAddress); }
        }

        string displayName;
        public string DisplayName
        {
            get { return displayName; }
            set { Set(ref displayName, value, () => DisplayName); }
        }

        public override string ToString()
        {
            return "{0} <{1}>".Formato(displayName, emailAddress);
        }

        public EmailAddressDN Clone()
        {
            return new EmailAddressDN
            {
                DisplayName = DisplayName,
                EmailAddress = EmailAddress,
                EmailOwner = EmailOwner
            }; 
        }

        public bool Equals(EmailAddressDN other)
        {
            return other.emailAddress == emailAddress && other.displayName == displayName;
        }

        public override bool Equals(object obj)
        {
            return obj is EmailAddressDN && Equals((EmailAddressDN)obj);
        }

        public override int GetHashCode()
        {
            return (emailAddress ?? "").GetHashCode() ^ (displayName ?? "").GetHashCode();
        }
    }

    public enum EmailSenderOperation
    {
        Save
    }

    public enum EmailRecipientOperation
    {
        Save
    }

    public enum EmailMessageState
    {
        Created,
        Sent,
        SentException,
        ReceptionNotified,
        Received
    }

    public interface IEmailOwnerDN : IIdentifiable
    {
        EmailOwnerData EmailOwnerData { get; }
    }

    [DescriptionOptions(DescriptionOptions.Description | DescriptionOptions.Members)]
    public class EmailOwnerData : IEquatable<EmailOwnerData>
    {
        public Lite<IEmailOwnerDN> Owner { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public CultureInfo CultureInfo { get; set; }

        public bool Equals(EmailOwnerData other)
        {
            return Owner != null && other != null && other.Owner != null && Owner.Equals(other.Owner);
        }

        public override bool Equals(object obj)
        {
            return obj is EmailOwnerData && Equals((EmailOwnerData)obj);
        }

        public override int GetHashCode()
        {
            return Owner == null ? base.GetHashCode() : Owner.GetHashCode();
        }

        public override string ToString()
        {
            return "{0} <{1}> ({2})".Formato(DisplayName, Email, Owner);
        }
    }

    public enum EmailMessageProcesses
    {
        SendEmails
    }

    public enum EmailMessageOperation
    {
        Send,
        ReSend,
        ReSendEmails,
        CreateMail,
        CreateMailFromTemplate,
        Delete,
    }

    public enum EmailMessageMessage
    {
        [Description("The email message cannot be sent from state {0}")]
        TheEmailMessageCannotBeSentFromState0,
        [Description("Message")]
        Message,
        Messages,
        RemainingMessages,
        ExceptionMessages,
        DefaultFromIsMandatory,
    }

    [Serializable, EntityKind(EntityKind.System, EntityData.Transactional)]
    public class EmailPackageDN : IdentifiableEntity, IProcessDataDN
    {
        [SqlDbType(Size = 200)]
        string name;
        [StringLengthValidator(AllowNulls = true, Max = 200)]
        public string Name
        {
            get { return name; }
            set { SetToStr(ref name, value, () => Name); }
        }

        public override string ToString()
        {
            return "EmailPackage {0}".Formato(Name);
        }
    }

    public enum EmailFileType
    {
        Attachment
    }
}

