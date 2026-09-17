package com.appintent.firewall

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.appintent.firewall.network.AnalysisRequest
import com.appintent.firewall.network.AnalysisResponse
import com.appintent.firewall.network.AppModel
import com.appintent.firewall.network.RetrofitClient
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FirewallApp()
        }
    }
}

// Colors from web prototype
val SurfaceColor = Color(0xFF09090B)
val BackgroundColor = Color(0xFF000000)
val BlockColor = Color(0xFFEF4444)
val AllowColor = Color(0xFF10B981)
val TextPrimary = Color(0xFFF8FAFC)
val TextSecondary = Color(0xFF94A3B8)
val BorderColor = Color(0xFF1E293B)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FirewallApp() {
    val coroutineScope = rememberCoroutineScope()
    
    var apps by remember { mutableStateOf<List<AppModel>>(emptyList()) }
    var selectedApp by remember { mutableStateOf<AppModel?>(null) }
    
    val permissions = listOf("CAMERA", "MICROPHONE", "LOCATION", "CONTACTS", "FILES", "CLIPBOARD")
    var selectedPermission by remember { mutableStateOf(permissions[0]) }
    
    val contexts = listOf("TAKING_PHOTO", "RECORDING_AUDIO", "NAVIGATION", "CALCULATING", "READING_NOTES", "BROWSING", "IDLE")
    var selectedContext by remember { mutableStateOf(contexts[0]) }
    
    var statusMessage by remember { mutableStateOf("READY") }
    var analysisResult by remember { mutableStateOf<AnalysisResponse?>(null) }
    var isAnalyzing by remember { mutableStateOf(false) }

    var expandedApp by remember { mutableStateOf(false) }
    var expandedPerm by remember { mutableStateOf(false) }
    var expandedCtx by remember { mutableStateOf(false) }

    // Fetch Apps on mount
    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getApps()
            if (response.isSuccessful) {
                apps = response.body() ?: emptyList()
                if (apps.isNotEmpty()) {
                    selectedApp = apps[0]
                }
            } else {
                statusMessage = "BACKEND UNAVAILABLE"
            }
        } catch (e: Exception) {
            statusMessage = "CONNECTION ERROR: ${e.message}"
        }
    }

    val analyzeRequest = { app: String, perm: String, ctx: String ->
        coroutineScope.launch {
            isAnalyzing = true
            statusMessage = "ANALYZING..."
            analysisResult = null
            try {
                val req = AnalysisRequest(appId = app, permission = perm, context = ctx)
                val response = RetrofitClient.apiService.analyzeRequest(req)
                if (response.isSuccessful) {
                    analysisResult = response.body()
                    statusMessage = "ANALYSIS COMPLETE"
                } else {
                    statusMessage = "BACKEND UNAVAILABLE"
                }
            } catch (e: Exception) {
                statusMessage = "CONNECTION ERROR: ${e.message}"
            } finally {
                isAnalyzing = false
            }
        }
    }

    MaterialTheme(
        colorScheme = darkColorScheme(
            background = BackgroundColor,
            surface = SurfaceColor,
            onBackground = TextPrimary,
            onSurface = TextPrimary
        )
    ) {
        Surface(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                // Header
                Column {
                    Text(
                            text = "APP INTENT",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 32.sp,
                            color = TextPrimary
                        )
                        Text(
                            text = "FIREWALL",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 32.sp,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "AI DEVICE SECURITY PROTOTYPE",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 12.sp,
                            color = TextSecondary,
                            letterSpacing = 2.sp
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(8.dp).background(AllowColor, RoundedCornerShape(4.dp)))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "PROTECTION ACTIVE",
                                fontFamily = FontFamily.Monospace,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = AllowColor
                            )
                        }
                    }

                // Demos
                Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Button(
                            onClick = { 
                                val camApp = apps.find { it.name.equals("Camera", ignoreCase = true) }
                                camApp?.let { analyzeRequest(it.id, "CAMERA", "TAKING_PHOTO") }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = AllowColor.copy(alpha = 0.1f)),
                            border = BorderStroke(1.dp, AllowColor.copy(alpha = 0.3f)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("SAFE TEST", color = AllowColor, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                        }
                        
                        Button(
                            onClick = { 
                                val calcApp = apps.find { it.name.equals("Calculator", ignoreCase = true) }
                                calcApp?.let { analyzeRequest(it.id, "MICROPHONE", "CALCULATING") }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = BlockColor.copy(alpha = 0.1f)),
                            border = BorderStroke(1.dp, BlockColor.copy(alpha = 0.3f)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("THREAT TEST", color = BlockColor, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                        }
                    }

                // Status
                Text(
                        text = statusMessage,
                        fontFamily = FontFamily.Monospace,
                        color = if (statusMessage.contains("ERROR")) BlockColor else TextSecondary,
                        fontSize = 12.sp
                    )

                // Simulator Form
                Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, BorderColor, RoundedCornerShape(8.dp))
                            .background(SurfaceColor, RoundedCornerShape(8.dp))
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text("SIMULATE PERMISSION REQUEST", fontFamily = FontFamily.Monospace, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        
                        // App Dropdown
                        ExposedDropdownMenuBox(
                            expanded = expandedApp,
                            onExpandedChange = { expandedApp = !expandedApp }
                        ) {
                            OutlinedTextField(
                                value = selectedApp?.name ?: "Loading Apps...",
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("APP", fontFamily = FontFamily.Monospace, fontSize = 10.sp) },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedApp) },
                                modifier = Modifier.menuAnchor().fillMaxWidth(),
                                colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
                            )
                            ExposedDropdownMenu(
                                expanded = expandedApp,
                                onDismissRequest = { expandedApp = false }
                            ) {
                                apps.forEach { app ->
                                    DropdownMenuItem(
                                        text = { Text(app.name, fontFamily = FontFamily.Monospace) },
                                        onClick = {
                                            selectedApp = app
                                            expandedApp = false
                                        }
                                    )
                                }
                            }
                        }

                        // Permission Dropdown
                        ExposedDropdownMenuBox(
                            expanded = expandedPerm,
                            onExpandedChange = { expandedPerm = !expandedPerm }
                        ) {
                            OutlinedTextField(
                                value = selectedPermission,
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("PERMISSION", fontFamily = FontFamily.Monospace, fontSize = 10.sp) },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedPerm) },
                                modifier = Modifier.menuAnchor().fillMaxWidth(),
                                colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
                            )
                            ExposedDropdownMenu(
                                expanded = expandedPerm,
                                onDismissRequest = { expandedPerm = false }
                            ) {
                                permissions.forEach { perm ->
                                    DropdownMenuItem(
                                        text = { Text(perm, fontFamily = FontFamily.Monospace) },
                                        onClick = {
                                            selectedPermission = perm
                                            expandedPerm = false
                                        }
                                    )
                                }
                            }
                        }

                        // Context Dropdown
                        ExposedDropdownMenuBox(
                            expanded = expandedCtx,
                            onExpandedChange = { expandedCtx = !expandedCtx }
                        ) {
                            OutlinedTextField(
                                value = selectedContext,
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("CONTEXT", fontFamily = FontFamily.Monospace, fontSize = 10.sp) },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expandedCtx) },
                                modifier = Modifier.menuAnchor().fillMaxWidth(),
                                colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
                            )
                            ExposedDropdownMenu(
                                expanded = expandedCtx,
                                onDismissRequest = { expandedCtx = false }
                            ) {
                                contexts.forEach { ctx ->
                                    DropdownMenuItem(
                                        text = { Text(ctx, fontFamily = FontFamily.Monospace) },
                                        onClick = {
                                            selectedContext = ctx
                                            expandedCtx = false
                                        }
                                    )
                                }
                            }
                        }

                        Button(
                            onClick = { 
                                selectedApp?.let { analyzeRequest(it.id, selectedPermission, selectedContext) }
                            },
                            enabled = !isAnalyzing && selectedApp != null,
                            colors = ButtonDefaults.buttonColors(containerColor = TextPrimary, contentColor = BackgroundColor),
                            modifier = Modifier.fillMaxWidth().height(48.dp)
                        ) {
                            Text("ANALYZE REQUEST", fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                        }
                    }

                // Result Screen
                analysisResult?.let { res ->
                    val isBlock = res.recommendation == "BLOCK"
                        val isAsk = res.recommendation == "ASK"
                        val color = if (isBlock) BlockColor else if (isAsk) Color(0xFFF59E0B) else AllowColor

                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, color.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                                .background(color.copy(alpha = 0.05f), RoundedCornerShape(8.dp))
                                .padding(24.dp),
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            Text("PERMISSION ANALYSIS", fontFamily = FontFamily.Monospace, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            
                            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                Column {
                                    Text("APP", fontSize = 10.sp, color = TextSecondary, fontFamily = FontFamily.Monospace)
                                    Text(res.appName, fontSize = 16.sp, color = TextPrimary, fontWeight = FontWeight.Bold)
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text("RISK SCORE", fontSize = 10.sp, color = TextSecondary, fontFamily = FontFamily.Monospace)
                                    Text("${res.riskScore}", fontSize = 32.sp, color = color, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                }
                            }
                            
                            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                Column {
                                    Text("REQUEST", fontSize = 10.sp, color = TextSecondary, fontFamily = FontFamily.Monospace)
                                    Text(res.permission, fontSize = 14.sp, color = TextPrimary)
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text("RISK LEVEL", fontSize = 10.sp, color = TextSecondary, fontFamily = FontFamily.Monospace)
                                    Text(res.riskLevel, fontSize = 14.sp, color = color, fontWeight = FontWeight.Bold)
                                }
                            }

                            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                Column {
                                    Text("CONTEXT", fontSize = 10.sp, color = TextSecondary, fontFamily = FontFamily.Monospace)
                                    Text(res.context, fontSize = 14.sp, color = TextPrimary)
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text("DECISION", fontSize = 10.sp, color = TextSecondary, fontFamily = FontFamily.Monospace)
                                    Text(res.recommendation, fontSize = 24.sp, color = color, fontWeight = FontWeight.Bold)
                                }
                            }

                            if (res.recommendation == "ALLOW") {
                                Text("✓ REQUEST ALLOWED", color = AllowColor, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }

                            Divider(color = color.copy(alpha = 0.2f))

                            Text("WHY?", fontSize = 12.sp, color = TextSecondary, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                res.reasons.forEach { reason ->
                                    Row {
                                        Text("• ", color = color, fontWeight = FontWeight.Bold)
                                        Text(reason, color = TextPrimary, fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }
                
                // Disclaimer
                Text(
                        text = "PROTOTYPE: This is a simulated permission-analysis interface demonstrating how a phone-level App Intent Firewall could integrate with the device. This does not intercept actual OS permission requests.",
                        color = TextSecondary.copy(alpha = 0.5f),
                        fontSize = 10.sp,
                        lineHeight = 14.sp,
                    modifier = Modifier.padding(top = 16.dp)
                )
            }
        }
    }
}
