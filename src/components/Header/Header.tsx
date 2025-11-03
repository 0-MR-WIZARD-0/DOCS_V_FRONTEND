import styles from "@/components/Header/Header.module.scss"
import Image from "next/image"
import logo from "@/app/assets/logo.png"

const Header = () => {
  return (
    <header className={styles.header}>
        <Image alt="logo" src={logo} className={styles.logo}/>
        <h2 className={styles.title}>ФГБУ “Национальный медицинский исследовательский центр высоких медицинских технологий - Центральный военный клинический госпиталь имени А.А. Вишневского” Министерства обороны Российской Федерации</h2>
    </header>
  )
}

export default Header