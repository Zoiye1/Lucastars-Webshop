/**
 * Represents a single email contact
 */
interface EmailAddress {
    /** Name of the contact */
    name?: string;
    /** Email address of the contact */
    address: string;
}

/**
 * Represents an email. Is only considered valid when all required fields are provided and either {@link text} or {@link html} have a value.
 */
interface Email {
    /** Sender of the email */
    from: EmailAddress;
    /** Receivers of the email */
    to: EmailAddress[] | string;
    /** Other receivers of the email */
    cc?: EmailAddress[] | string;
    /** Blind receivers of the email */
    bcc?: EmailAddress[] | string;
    /** Subject of the email */
    subject: string;
    /** Contents of the email as text */
    text?: string;
    /** Contents of the email as html */
    html?: string;
}

interface MailResponse {
    message: string;
}

export class EmailService {
    private readonly _mailApiUrl: string = "https://api.hbo-ict.cloud/mail";

    public async sendMail(to: string, subject: string, body: string): Promise<boolean> {
        const email: Email = {
            from: {
                name: "Info",
                address: "wiigiivuukii32@hbo-ict.cloud",
            },
            to: [
                {
                    address: to,
                },
            ],
            subject: subject,
            html: body,
        };

        const response: Response = await fetch(this._mailApiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HBOICTCLOUD_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(email),
        });

        if (!response.ok) {
            throw new Error(`Failed to send email: ${response.status}`);
        }

        const responseData: MailResponse = await response.json() as MailResponse;

        console.log("EmailService.sendMail response:", responseData);

        return true;
    }
}
