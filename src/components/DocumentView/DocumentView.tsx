
import styles from "@/components/DocumentView/DocumentView.module.scss"

type Props = {
  name: string
  date: string
  url: string
}

export default function DocumentView({ name, date, url }: Props) {
  return (
    <div className={styles.document_wrapper}>
      <div>
        <a href={url} target="_blank" rel="noreferrer">{name}</a>
        <p>Добавлен: {new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  )
}