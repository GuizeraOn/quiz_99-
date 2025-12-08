import clsx from 'clsx';

interface FormattedTextProps {
    text: string;
    className?: string;
}

export default function FormattedText({ text, className }: FormattedTextProps) {
    return (
        <span
            className={clsx("block", className)}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
}
