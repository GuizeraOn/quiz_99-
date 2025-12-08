import React from 'react';

interface RichTextProps {
    content: string;
    className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ content, className = '' }) => {
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default RichText;
