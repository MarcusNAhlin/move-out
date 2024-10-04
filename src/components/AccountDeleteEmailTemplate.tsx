import * as React from 'react';

interface EmailTemplateProps {
    token: string;
}

export const AccountDeleteEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    token
}) => (
    <div>
        <h1>Delete Your Account - MoveOut</h1>
        <p>
            If you wish to delete your account, please verify your email address by clicking the link below:
        </p>
        <p>
            ATTENTION! This action is not reversible and will delete all your data permanently!
        </p>
        <a
            href={`${process.env.NEXTAUTH_URL}/profile/delete-account/verify?token=${token}`}
        >
            DELETE MY ACCOUNT AND ALL ITS DATA
        </a>
    </div>
);

