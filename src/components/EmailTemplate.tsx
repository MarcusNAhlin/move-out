import * as React from 'react';

interface EmailTemplateProps {
    token: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    token
}) => (
    <div>
        <h1>Welcome to MoveOut!</h1>
        <p>
            Please verify your email address by clicking the link below:
        </p>
        <a
            href={`${process.env.NEXTAUTH_URL}/verify?token=${token}`}
        >
            Click To Verify Email
        </a>
    </div>
);

