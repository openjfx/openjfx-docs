plugins {
    application
}

application {
    mainClassName = "HelloFX"
}

val currentOS = org.gradle.internal.os.OperatingSystem.current()!!
val platform = when {
    currentOS.isWindows -> "win"
    currentOS.isLinux -> "linux"
    currentOS.isMacOsX -> "mac"
    else -> ""
}

fun addToModulePath(file: File) = when {
    file.name.startsWith("javafx-") -> true
    else -> false
}

fun modularArgs(classpath: FileCollection) = listOf(
        "--module-path", classpath.filter{addToModulePath(it)}.asPath,
        "--add-modules", "javafx.controls"
)

tasks {
    named<JavaCompile>("compileJava") {
        doFirst {
            options.compilerArgs = modularArgs(classpath)
            classpath = classpath.filter{!addToModulePath(it)}
        }
    }

    named<JavaExec>("run") {
        doFirst {
            jvmArgs = modularArgs(classpath)
            classpath = classpath.filter{!addToModulePath(it)}
        }
    }
}

dependencies {
    compile("org.openjfx:javafx-base:11:$platform")
    compile("org.openjfx:javafx-graphics:11:$platform")
    compile("org.openjfx:javafx-controls:11:$platform")
}

repositories {
    mavenCentral()
}
