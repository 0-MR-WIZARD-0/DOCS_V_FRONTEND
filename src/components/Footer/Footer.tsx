import styles from "@/components/Footer/Footer.module.scss"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <Link href="https://3hospital.ru/contacts">Техническая поддержка</Link>
        <p>ФГБУ «НМИЦ ВМТ им. А.А. Вишневского» Минобороны России</p>
      </div>
    </footer>
  )
}

export default Footer