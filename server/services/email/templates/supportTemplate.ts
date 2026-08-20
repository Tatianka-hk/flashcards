import { escapeHtml } from '../../../utils/emails'

export const templateSupport = ({
    email,
    message,
}: {
    email: string
    message: string
}) => {
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message)

    return `
        <!doctype html>
        <html lang="uk">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Новий запит</title>
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
                                <!-- Header -->
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
                                        "
                                    >
                                        <h1
                                            style="
                                                margin: 0 0 30px;
                                                text-align: center;
                                                font-size: 28px;
                                                line-height: 1.3;
                                                font-weight: 500;
                                                color: #4b4444;
                                            "
                                        >
                                            Новий запит
                                        </h1>

                                        <!-- Email -->
                                        <p
                                            style="
                                                margin: 0 0 8px;
                                                font-size: 13px;
                                                line-height: 1.6;
                                                font-weight: 600;
                                                color: #4b4444;
                                            "
                                        >
                                            Пошта
                                        </p>

                                        <table
                                            width="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            border="0"
                                            role="presentation"
                                            style="
                                                width: 100%;
                                                background-color: #f8d9d5;
                                                border: 1px solid #4b4444;
                                                margin-bottom: 28px;
                                            "
                                        >
                                            <tr>
                                                <td
                                                    style="
                                                        padding: 14px 16px;
                                                    "
                                                >
                                                    <a
                                                        href="mailto:${safeEmail}"
                                                        style="
                                                            font-size: 15px;
                                                            line-height: 1.6;
                                                            color: #181414;
                                                            text-decoration: none;
                                                            word-break: break-all;
                                                        "
                                                    >
                                                        ${safeEmail}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Message -->
                                        <p
                                            style="
                                                margin: 0 0 8px;
                                                font-size: 13px;
                                                line-height: 1.6;
                                                font-weight: 600;
                                                color: #4b4444;
                                            "
                                        >
                                            Повідомлення
                                        </p>

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
                                                        font-size: 15px;
                                                        line-height: 1.7;
                                                        color: #4b4444;
                                                        white-space: pre-wrap;
                                                        word-break: break-word;
                                                    "
                                                >${safeMessage}</td>
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
                                        Новий запит із форми підтримки Flashcards
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `
}
