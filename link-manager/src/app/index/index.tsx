import { Image, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "./styles";
import { colors } from "@/styles/colors";
import { Category } from "@/components/category";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require("@/assets/logo.png")} 
          style={styles.logo}
        />
        <TouchableOpacity>
          <MaterialIcons name="add" size={32} color={colors.green[300]}/>
        </TouchableOpacity>
      </View>
      <Category title="Projetos" icon="code" isSelected/>
      <Category title="Site" icon="language"/>
      <Category title="Videos" icon="movie"/>
    </View>
  )
}