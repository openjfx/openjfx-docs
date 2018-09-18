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

tasks {
    named<JavaCompile>("compileJava") {
        doFirst {
            options.compilerArgs = listOf(
                    "--module-path", classpath.asPath,
                    "--add-modules", "javafx.controls"
            )
        }
    }

    named<JavaExec>("run") {
        doFirst {
            jvmArgs = listOf(
                    "--module-path", classpath.asPath,
                    "--add-modules", "javafx.controls"
            )
        }
    }
}

dependencies {
    compile("org.openjfx:javafx-base:11:${platform}")
    compile("org.openjfx:javafx-graphics:11:${platform}")
    compile("org.openjfx:javafx-controls:11:${platform}")
}

repositories {
    mavenCentral()
}
