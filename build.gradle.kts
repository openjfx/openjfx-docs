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

fun addToModulePath(file: File) = file.name.startsWith("javafx-")

fun javaArgs(classpath: FileCollection) = listOf(
        "--module-path", classpath.filter{addToModulePath(it)}.asPath,
        "--add-modules", "javafx.controls"
)

tasks {
    named<JavaCompile>("compileJava") {
        doFirst {
            options.compilerArgs = javaArgs(classpath)
            classpath = classpath.filter{!addToModulePath(it)}
        }
    }

    named<JavaExec>("run") {
        doFirst {
            jvmArgs = javaArgs(classpath)
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
