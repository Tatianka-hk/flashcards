import { EmailTemplateParams, getEmailTranslation } from '~/server/utils/emails'

export function buildVerificationEmailTemplate({
    locale,
    link,
}: EmailTemplateParams) {
    const t = (key: string) =>
        getEmailTranslation(locale, `email.verify-email.${key}`)

    const subject = t('subject')

    const text = `
${t('welcome')}

${t('description')}

${link}

${t('expires')}

${t('fallback')}
${link}
    `.trim()

    const html = `
    <!doctype html>
    <html lang="${locale}">
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>${t('subject')}</title>
        </head>

        <body
            style="
                margin: 0;
                padding: 0;
                background-color: #f4edf6;
                font-family: Arial, Helvetica, sans-serif;
                color: #4b4444;
            "
        >
            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                    width: 100%;
                    background-color: #f4edf6;
                    padding: 40px 16px;
                "
            >
                <tr>
                    <td align="center">
                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            role="presentation"
                            style="
                                width: 100%;
                                max-width: 600px;
                                background-color: #f4edf6;
                                border: 1px solid #4b4444;
                            "
                        >
                            <!-- Logo / Header -->
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        padding: 36px 32px 24px;
                                        border-bottom: 1px solid #4b4444;
                                    "
                                >
                                    <div
                                        style="
                                            font-size: 28px;
                                            line-height: 1.2;
                                            letter-spacing: 4px;
                                            font-weight: 300;
                                            color: #4b4444;
                                        "
                                    >
                                        FLASHCARDS
                                    </div>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td
                                    style="
                                        padding: 40px;
                                        text-align: center;
                                    "
                                >
                                    <h1
                                        style="
                                            margin: 0 0 24px;
                                            font-size: 28px;
                                            line-height: 1.3;
                                            font-weight: 500;
                                            color: #4b4444;
                                        "
                                    >
                                        ${t('title')}
                                    </h1>

                                    <p
                                        style="
                                            margin: 0 0 12px;
                                            font-size: 18px;
                                            line-height: 1.6;
                                            font-weight: 600;
                                            color: #4b4444;
                                        "
                                    >
                                        ${t('welcome')}
                                    </p>

                                    <p
                                        style="
                                            margin: 0 0 30px;
                                            font-size: 16px;
                                            line-height: 1.7;
                                            color: #4b4444;
                                        "
                                    >
                                        ${t('description')}
                                    </p>

                                    <!-- Verification button -->
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        role="presentation"
                                        align="center"
                                        style="margin: 0 auto 30px;"
                                    >
                                        <tr>
                                            <td
                                                align="center"
                                                style="
                                                    background-color: #f8d9d5;
                                                    border: 1px solid #4b4444;
                                                "
                                            >
                                                <a
                                                    href="${link}"
                                                    target="_blank"
                                                    style="
                                                        display: inline-block;
                                                        padding: 15px 32px;
                                                        font-size: 16px;
                                                        line-height: 1.2;
                                                        font-weight: 600;
                                                        color: #181414;
                                                        text-decoration: none;
                                                    "
                                                >
                                                    ${t('button')}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p
                                        style="
                                            margin: 0 0 26px;
                                            font-size: 14px;
                                            line-height: 1.6;
                                            color: #4b4444;
                                        "
                                    >
                                        ${t('expires')}
                                    </p>

                                    <!-- Fallback -->
                                    <table
                                        width="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        role="presentation"
                                        style="
                                            width: 100%;
                                            background-color: #d8e2ec;
                                        "
                                    >
                                        <tr>
                                            <td
                                                style="
                                                    padding: 18px;
                                                    text-align: left;
                                                "
                                            >
                                                <p
                                                    style="
                                                        margin: 0 0 10px;
                                                        font-size: 13px;
                                                        line-height: 1.6;
                                                        color: #4b4444;
                                                    "
                                                >
                                                    ${t('fallback')}
                                                </p>

                                                <a
                                                    href="${link}"
                                                    target="_blank"
                                                    style="
                                                        font-size: 13px;
                                                        line-height: 1.6;
                                                        color: #4e9c83;
                                                        word-break: break-all;
                                                    "
                                                >
                                                    ${link}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        padding: 22px 32px;
                                        border-top: 1px solid #4b4444;
                                        font-size: 12px;
                                        line-height: 1.6;
                                        color: #4b4444;
                                    "
                                >
                                    ${t('ignore')}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>
    `

    return {
        subject,
        text,
        html,
    }
}
