import styles from "@/components/DocumentView/DocumentView.module.scss"

type Props = {
  name: string
  description: string;
  date: string;
  url: string | undefined;
}

export default function DocumentView({ name, description, date, url }: Props) {
  
  return (
    <div className={styles.document_wrapper}>
      <div>
        <div>
          <h4>
            <a href={url} target="_blank" rel="noreferrer">{name}</a>
          </h4>
          <p>{description}</p>
        </div>
        <p>Опубликовано: {new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  )
}