VERSION 5.00
Begin VB.Form FormMain 
   Caption         =   "Enregistreur Piscine"
   ClientHeight    =   5835
   ClientLeft      =   1485
   ClientTop       =   1875
   ClientWidth     =   9795
   Icon            =   "EcranEnregistreur.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   5835
   ScaleWidth      =   9795
   Begin VB.CheckBox mCheckSimulation 
      Caption         =   "Simulation"
      Height          =   255
      Left            =   8280
      TabIndex        =   24
      Top             =   3960
      Width           =   1215
   End
   Begin VB.PictureBox mPictureYesterday 
      BackColor       =   &H00FFFFC0&
      BorderStyle     =   0  'None
      Height          =   1215
      Left            =   120
      ScaleHeight     =   81
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   633
      TabIndex        =   14
      Top             =   2160
      Width           =   9495
   End
   Begin VB.Frame Frame2 
      Caption         =   "Paramètres"
      Height          =   1455
      Left            =   240
      TabIndex        =   9
      Top             =   4320
      Width           =   3015
      Begin VB.TextBox mTextThreshold 
         Alignment       =   1  'Right Justify
         Height          =   285
         Left            =   1440
         TabIndex        =   43
         Text            =   "10"
         Top             =   960
         Width           =   975
      End
      Begin VB.ComboBox mComboGain 
         Height          =   315
         ItemData        =   "EcranEnregistreur.frx":0E42
         Left            =   1440
         List            =   "EcranEnregistreur.frx":0E53
         Style           =   2  'Dropdown List
         TabIndex        =   38
         Top             =   600
         Width           =   1335
      End
      Begin VB.ComboBox mComboCanal 
         Height          =   315
         ItemData        =   "EcranEnregistreur.frx":0E6D
         Left            =   1440
         List            =   "EcranEnregistreur.frx":0E7D
         Style           =   2  'Dropdown List
         TabIndex        =   10
         Top             =   240
         Width           =   1335
      End
      Begin VB.Label Label24 
         Caption         =   "V"
         Height          =   255
         Left            =   2520
         TabIndex        =   44
         Top             =   1005
         Width           =   255
      End
      Begin VB.Label Label23 
         Caption         =   "Seuil Marche"
         Height          =   255
         Left            =   120
         TabIndex        =   42
         Top             =   1005
         Width           =   1335
      End
      Begin VB.Label Label22 
         Caption         =   "Volts Entrée"
         Height          =   255
         Left            =   120
         TabIndex        =   39
         Top             =   645
         Width           =   1335
      End
      Begin VB.Label Label9 
         Caption         =   "Enregistrer depuis"
         Height          =   255
         Left            =   120
         TabIndex        =   11
         Top             =   285
         Width           =   1335
      End
   End
   Begin VB.Timer mTimer1 
      Enabled         =   0   'False
      Interval        =   60000
      Left            =   7680
      Top             =   3720
   End
   Begin VB.CommandButton mBtnStop 
      Caption         =   "Arrêter"
      Height          =   495
      Left            =   1920
      TabIndex        =   8
      Top             =   3720
      Width           =   1455
   End
   Begin VB.Frame Frame1 
      Caption         =   "Dernière Données Enregistreur"
      Height          =   1455
      Left            =   3360
      TabIndex        =   3
      Top             =   4320
      Width           =   6255
      Begin VB.CommandButton mBtnUpdateNow 
         Caption         =   "Mettre à jour"
         Height          =   375
         Left            =   4680
         TabIndex        =   40
         Top             =   720
         Width           =   1455
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   1
         Left            =   2040
         TabIndex        =   22
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   0
         Left            =   1080
         TabIndex        =   21
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   3
         Left            =   3720
         TabIndex        =   20
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   2
         Left            =   2880
         TabIndex        =   19
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox mTextLoggerIndex 
         Height          =   285
         Left            =   240
         TabIndex        =   17
         Top             =   840
         Width           =   735
      End
      Begin VB.Label mLabelTime 
         Caption         =   "(heure)"
         Height          =   255
         Left            =   720
         TabIndex        =   23
         Top             =   240
         Width           =   2655
      End
      Begin VB.Label Label36 
         Caption         =   "Index"
         Height          =   255
         Left            =   240
         TabIndex        =   18
         Top             =   600
         Width           =   735
      End
      Begin VB.Label Label4 
         Caption         =   "CH1"
         Height          =   195
         Left            =   1320
         TabIndex        =   7
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label5 
         Caption         =   "CH2"
         Height          =   195
         Left            =   2160
         TabIndex        =   6
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label6 
         Caption         =   "CH3"
         Height          =   195
         Left            =   3000
         TabIndex        =   5
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label7 
         Caption         =   "CH4"
         Height          =   195
         Left            =   3840
         TabIndex        =   4
         Top             =   600
         Width           =   375
      End
   End
   Begin VB.PictureBox mPictureToday 
      BackColor       =   &H00C0FFC0&
      BorderStyle     =   0  'None
      Height          =   1215
      Left            =   120
      ScaleHeight     =   81
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   633
      TabIndex        =   2
      Top             =   360
      Width           =   9495
   End
   Begin VB.CheckBox mCheckLED 
      Caption         =   "Allumer LED"
      Height          =   375
      Left            =   8280
      TabIndex        =   1
      Top             =   3600
      Width           =   1335
   End
   Begin VB.CommandButton mBtnStart 
      Caption         =   "Démarrer"
      Height          =   495
      Left            =   240
      TabIndex        =   0
      Top             =   3720
      Width           =   1455
   End
   Begin VB.Label mLabelError 
      Caption         =   "(error placeholder)"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H000000FF&
      Height          =   255
      Left            =   3600
      TabIndex        =   41
      Top             =   3960
      Width           =   3735
   End
   Begin VB.Label Label21 
      Alignment       =   2  'Center
      Caption         =   "22"
      Height          =   255
      Left            =   8640
      TabIndex        =   37
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label20 
      Alignment       =   2  'Center
      Caption         =   "20"
      Height          =   255
      Left            =   7920
      TabIndex        =   36
      Top             =   1680
      Width           =   255
   End
   Begin VB.Label Label19 
      Alignment       =   2  'Center
      Caption         =   "16"
      Height          =   255
      Left            =   6240
      TabIndex        =   35
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label18 
      Alignment       =   2  'Center
      Caption         =   "14"
      Height          =   255
      Left            =   5520
      TabIndex        =   34
      Top             =   1680
      Width           =   255
   End
   Begin VB.Label Label17 
      Alignment       =   2  'Center
      Caption         =   "10"
      Height          =   255
      Left            =   3840
      TabIndex        =   33
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label16 
      Alignment       =   2  'Center
      Caption         =   "8"
      Height          =   255
      Left            =   3120
      TabIndex        =   32
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label15 
      Alignment       =   2  'Center
      Caption         =   "4"
      Height          =   255
      Left            =   1560
      TabIndex        =   31
      Top             =   1680
      Width           =   255
   End
   Begin VB.Label Label14 
      Alignment       =   2  'Center
      Caption         =   "2"
      Height          =   255
      Left            =   720
      TabIndex        =   30
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label13 
      Alignment       =   2  'Center
      Caption         =   "18"
      Height          =   255
      Left            =   7080
      TabIndex        =   29
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label8 
      Alignment       =   2  'Center
      Caption         =   "12"
      Height          =   255
      Left            =   4680
      TabIndex        =   28
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label3 
      Alignment       =   2  'Center
      Caption         =   "6"
      Height          =   255
      Left            =   2400
      TabIndex        =   27
      Top             =   1680
      Width           =   255
   End
   Begin VB.Label Label2 
      Alignment       =   1  'Right Justify
      Caption         =   "24"
      Height          =   255
      Left            =   9360
      TabIndex        =   26
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label1 
      Caption         =   "0"
      Height          =   255
      Left            =   120
      TabIndex        =   25
      Top             =   1680
      Width           =   135
   End
   Begin VB.Label Label12 
      Alignment       =   2  'Center
      Caption         =   "Hier"
      Height          =   255
      Left            =   360
      TabIndex        =   16
      Top             =   1920
      Width           =   495
   End
   Begin VB.Line Line1 
      X1              =   120
      X2              =   9600
      Y1              =   2040
      Y2              =   2040
   End
   Begin VB.Label Label11 
      Caption         =   "Aujourd'hui"
      Height          =   255
      Left            =   240
      TabIndex        =   15
      Top             =   120
      Width           =   1815
   End
   Begin VB.Label mLabelStatus 
      Caption         =   "(status)"
      Height          =   255
      Left            =   4200
      TabIndex        =   13
      Top             =   3720
      Width           =   3135
   End
   Begin VB.Label Label10 
      Caption         =   "Etat:"
      Height          =   255
      Left            =   3600
      TabIndex        =   12
      Top             =   3720
      Width           =   495
   End
End
Attribute VB_Name = "FormMain"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Option Base 0

'Declare use of the DLL
'K8047D.DLL interface

'GENERAL PROCEDURES
Private Declare Sub StartDevice Lib "k8047d.dll" ()
Private Declare Sub StopDevice Lib "k8047d.dll" ()

'INPUT PROCEDURE
Private Declare Sub ReadData Lib "k8047d.dll" (Array_Pointer As Long)

'OUTPUT PROCEDURE
Private Declare Sub SetGain Lib "k8047d.dll" (ByVal Channel_no As Long, ByVal Gain As Long)
Private Declare Sub LEDon Lib "k8047d.dll" ()
Private Declare Sub LEDoff Lib "k8047d.dll" ()

'Declare variables
Dim DataBuffer(7) As Long

'1 Day = 60*24=1440 minutes
Const DataSize As Integer = 1440
Const DataVersion As Integer = 4

Const FichierEtatCourrant As String = "EtatCourrant.bin"

' Non-saved state
Dim StartTime As Variant
Dim CurrentDataThreshold As Integer ' 0..255 for actual threshold
Dim CurrentVoltCoef As Double

' Saved state
Dim Canal As Integer
Dim Gain As Integer
Dim Threshold As Integer ' en Volts pour affichage
Dim Simulation As Boolean
Dim DayIndex As Integer
Dim LastWritten As Integer
Dim DataYesterday(DataSize) As Integer
Dim DataToday(DataSize) As Integer


Private Sub Form_Load()
    Dim i As Integer

    mLabelError.Caption = ""

    If Not LoadState Then
        Simulation = False
        DayIndex = 0
        Canal = 0
        Gain = 1
        Threshold = 10
    
        For i = 0 To DataSize - 1
            DataToday(i) = -1
            DataYesterday(i) = -1
        Next i
    End If
    If Gain < 1 Then Gain = 1
    
    For i = 0 To 3
        If Int(mComboCanal.ItemData(i)) = Canal Then
            mComboCanal.ListIndex = i
        End If
        If Int(mComboGain.ItemData(i)) = Gain Then
            mComboGain.ListIndex = i
        End If
    Next
    
    ' Commence en mode arrete
    mBtnStop_Click
    
    If Simulation Then
        mTimer1.Interval = 1000 ' 1 second
    Else
        mTimer1.Interval = 60000 ' 1 minute
    End If
    mTimer1.Enabled = False
    
    mTextThreshold.Text = Threshold
    If Simulation Then mCheckSimulation.Value = 1
    
    Form_Paint
End Sub

Private Sub Form_Paint()
    DrawPicture mPictureToday, DataToday
    DrawPicture mPictureYesterday, DataYesterday
End Sub

Private Sub Form_Terminate()
    mBtnStop_Click
    SaveState
End Sub

Private Sub mComboCanal_Click()
    Canal = Int(mComboCanal.ItemData(mComboCanal.ListIndex))
End Sub

Private Sub mComboGain_Click()
    ' Gain: 1=30V, 2=15V, 5=6V, 10=3V
    Gain = Int(mComboGain.ItemData(mComboGain.ListIndex))
    CurrentVoltCoef = 30 / Gain / 256

    If Not Simulation Then
        SetGain 1, Gain
        SetGain 2, Gain
        SetGain 3, Gain
        SetGain 4, Gain
    End If
    
    mTextThreshold_Change
End Sub

Private Sub mCheckLED_Click()
    If mCheckLED.Value = 1 Then LEDon Else LEDoff
End Sub

Private Sub mCheckSimulation_Click()
    Simulation = (mCheckSimulation.Value = 1)
End Sub

Private Sub mBtnStart_Click()
    
    If Not Simulation Then StartDevice
    
    mComboCanal_Click
    mComboGain_Click
    
    mTimer1.Enabled = True
    StartTime = Time
    If Simulation Then
        mLabelStatus.Caption = "Enregistrement (simulation)"
    Else
        mLabelStatus.Caption = "Enregistrement en cours"
    End If
End Sub

Private Sub mBtnStop_Click()
    mTimer1.Enabled = False
    mLabelStatus.Caption = "Arrêté"
    If Not Simulation Then StopDevice
    SaveState
End Sub

Private Sub mTextThreshold_Change()
    Dim i, v As Integer
    
    i = 0
    On Error Resume Next ' Int() can fail
    i = Int(mTextThreshold.Text)
    v = 30 / Gain
        
    CurrentDataThreshold = 256 * i / v
    
    Form_Paint
End Sub

Private Sub mTimer1_Timer()
    ReadOne
    If DayIndex >= DataSize Then
        SwitchNextDay
    End If
    ' save sate every hour
    If DayIndex Mod 60 = 0 Then
        SaveState
    End If
End Sub

Private Sub mBtnUpdateNow_Click()
    mTimer1_Timer
End Sub

Private Sub ReadOne()
    Dim i As Integer
    Dim s As String
    Dim t, h, m As Variant
    
    t = Time
    h = Hour(t)
    m = Minute(t)
    DayIndex = h * 60 + m
    mLabelTime.Caption = Format(h, "00") + "h " + Format(m, "00")
    
    If Not Simulation Then
        ReadData DataBuffer(0)
    Else
        SimulateRead
    End If
    
    mTextLoggerIndex.Text = Format(DataBuffer(0)) + "," + Format(DataBuffer(1))
    For i = 0 To 3
        mTextVolt(i).Text = Format(CurrentVoltCoef * DataBuffer(2 + i), "0.0 V")
    Next

    If Canal >= 0 And Canal <= 3 Then
        ' canal 0..3 is data byte #2..6
        DataToday(DayIndex) = DataBuffer(Canal + 2)
        
        DrawPicture mPictureToday, DataToday
        DayIndex = DayIndex + 1
    End If
    
End Sub

Private Sub SwitchNextDay()
    Dim i As Integer
    
    ' Transfer today to yesterday
    For i = 0 To DataSize - 1
        DataYesterday(i) = DataToday(i)
        DataToday(i) = -1
    Next i
    DayIndex = 0
    DrawPicture mPictureYesterday, DataYesterday
End Sub

Private Sub SimulateRead()
    Dim b, i As Integer
    Dim t1, t2 As Long
    
    t1 = Hour(Time) * 3600 + Minute(Time) * 60 + Second(Time)
    t2 = Hour(StartTime) * 3600 + Minute(StartTime) * 60 + Second(StartTime)
    DayIndex = (t1 - t2) Mod DataSize
    t1 = DayIndex Mod 60
    t2 = Int(DayIndex / 60)
    mLabelTime.Caption = Format(t2, "00") + "h " + Format(t1, "00")
    
    b = 255 * ((Sin(DayIndex * 3.14159265385 * 6 / DataSize) + 1) / 2)
    For i = 0 To 5
        DataBuffer(i) = (256 + b - 40 + 20 * i) Mod 256
    Next
End Sub

Private Sub DrawPicture(ByRef picbox As PictureBox, ByRef data() As Integer)
    Dim w, h As Integer
    Dim d, i, x, y, y1, y2, x1, x2, lastx As Integer
    Dim xcoef, ycoef, tcoef As Double
    
    picbox.Refresh
    
    w = picbox.ScaleWidth
    h = picbox.ScaleHeight
    
    y1 = 1
    y2 = h - 2
    ycoef = (y2 - y1) / 256
    
    x1 = 1
    x2 = w - 2
    xcoef = (x2 - x1) / DataSize
    
    ' Couleurs: http://msdn.microsoft.com/en-us/library/d2dz8078(VS.80).aspx
    
    picbox.ForeColor = QBColor(10) ' light green
    y = y2 - CurrentDataThreshold * ycoef
    picbox.Line (0, y)-(w, y)
    
    picbox.ForeColor = QBColor(8) ' gris
    picbox.Line (0, 0)-(w, 0)
    picbox.Line (0, h - 1)-(w, h - 1)

    tcoef = (w - 1) / 24
    For i = 0 To 24
        x = i * tcoef
        If i Mod 6 = 0 Then
            y = 0
        ElseIf i Mod 2 = 0 Then
            y = h / 2
        Else
            y = h * 3 / 4
        End If
        picbox.Line (x, y)-(x, h)
    Next

    lastx = -1
    For i = 0 To DataSize - 1
        d = data(i)
        If d >= 0 Then
            y = y2 - d * ycoef
            x = x1 + i * xcoef
            If lastx < 0 Then
                lastx = x
                picbox.CurrentX = x
                picbox.CurrentY = y
            End If
            If d > CurrentDataThreshold Then
                picbox.ForeColor = QBColor(12) ' light red
            Else
                picbox.ForeColor = QBColor(0) ' noir
            End If
            picbox.Line -(x, y)
        Else
            lastx = -1
        End If
    Next i
End Sub

Private Function LoadState() As Boolean
    Dim f, version As Integer
    version = 0
    
    On Error GoTo erreur_load
    f = FreeFile
    Open App.Path & "\" & FichierEtatCourrant For Binary Access Read Lock Write As f
    
    If LOF(f) > 0 Then
        Get f, 1, version
                
        If version = DataVersion Then
            Get f, , Canal
            Get f, , Gain
            Get f, , Threshold
            Get f, , Simulation
            Get f, , DayIndex
            Get f, , LastWritten
            Get f, , DataYesterday
            Get f, , DataToday
        End If
    End If
    Close f
    
    LoadState = (version = DataVersion)
    Exit Function

erreur_load:
    ' ignore
    LoadState = False
End Function

Private Sub SaveState()
    Dim f As Integer
    
    On Error GoTo erreur_save
    f = FreeFile
    Open App.Path & "\" & FichierEtatCourrant For Binary Access Write Lock Write As f
    Put f, 1, DataVersion
    
    Put f, , Canal
    Put f, , Gain
    Put f, , Threshold
    Put f, , Simulation
    Put f, , DayIndex
    Put f, , LastWritten
    Put f, , DataYesterday
    Put f, , DataToday
    Close f
    Exit Sub
    
erreur_save:
    DisplayError "Etat pas sauvé"
End Sub

Private Sub DisplayError(ByVal str As String)
    mLabelError.Caption = str + " (" + Format(Err.Number) + " : " + Err.Description + ")"
    Err.Clear
End Sub
