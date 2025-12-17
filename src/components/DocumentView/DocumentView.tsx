import styles from "@/components/DocumentView/DocumentView.module.scss"

type Props = {
  name: string
  description: string;
  url: string | undefined;
}

export default function DocumentView({ name, description, url }: Props) {
  return (
    <div className={styles.document_wrapper}>
      <div>
          <h4>
            <a href={url} target="_blank" rel="noreferrer">{name}</a>
          </h4>
          {(description ? <p>{description}</p> : "")}
      </div>
    </div>
  )
}